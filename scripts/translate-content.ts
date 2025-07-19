import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Translation service interface
interface TranslationService {
  translate(text: string, sourceLanguage: string, targetLanguage: string): Promise<string>;
}

// OpenAI Translation implementation
class OpenAITranslationService implements TranslationService {
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model: string = 'gpt-4o') {
    this.apiKey = apiKey;
    this.model = model;
    if (!apiKey) {
      throw new Error('OpenAI API key is required');
    }
  }

  async translate(text: string, sourceLanguage: string, targetLanguage: string): Promise<string> {
    try {
      const url = 'https://api.openai.com/v1/chat/completions';
      
      // Prepare the prompt for translation
      const prompt = `Translate the following ${sourceLanguage === 'ko' ? 'Korean' : 'English'} text to ${targetLanguage === 'ko' ? 'Korean' : 'English'}. 
Maintain the original formatting, including markdown syntax, code blocks, and special characters. 
Preserve all code examples exactly as they are without translating variable names, function names, or comments within code blocks.
Preserve all links and image references.

Text to translate:
${text}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: 'You are a professional translator specializing in technical content. Your translations are accurate, natural-sounding, and preserve all technical terminology, markdown formatting, and code blocks exactly as they appear in the original.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3, // Lower temperature for more consistent translations
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`OpenAI API error: ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      return data.choices[0].message.content.trim();
    } catch (error) {
      console.error('Translation error:', error);
      throw error;
    }
  }
}

// Content types
type ContentType = 'posts' | 'products' | 'authors';

// Translation config
interface TranslationConfig {
  sourceLocale: string;
  targetLocale: string;
  contentType: ContentType;
}

// Function to translate MDX content
async function translateMdxContent(
  sourcePath: string,
  targetPath: string,
  service: TranslationService,
  sourceLocale: string,
  targetLocale: string
): Promise<void> {
  try {
    console.log(`Translating ${sourcePath} to ${targetPath}`);
    
    // Read source file
    const source = fs.readFileSync(sourcePath, 'utf8');
    
    // Parse frontmatter and content
    const { data: frontmatter, content } = matter(source);
    
    // Check if target file exists and has manualTranslation flag
    let existingManualTranslation = false;
    if (fs.existsSync(targetPath)) {
      try {
        const targetContent = fs.readFileSync(targetPath, 'utf8');
        const { data: targetFrontmatter } = matter(targetContent);
        existingManualTranslation = targetFrontmatter.manualTranslation === true;
      } catch (error) {
        // Ignore errors
      }
    }
    
    // Clone frontmatter for translation
    const translatedFrontmatter: Record<string, any> = { ...frontmatter };
    
    // Preserve manualTranslation flag if it was set
    if (existingManualTranslation) {
      translatedFrontmatter.manualTranslation = true;
    }
    
    // Translate title and excerpt
    if (frontmatter.title) {
      translatedFrontmatter.title = await service.translate(
        frontmatter.title,
        sourceLocale,
        targetLocale
      );
    }
    
    if (frontmatter.excerpt) {
      translatedFrontmatter.excerpt = await service.translate(
        frontmatter.excerpt,
        sourceLocale,
        targetLocale
      );
    }
    
    // Translate tags if they're in Korean
    if (frontmatter.tags && Array.isArray(frontmatter.tags)) {
      const koreanTagRegex = /[가-힣]/; // Korean character range
      const hasKoreanTags = frontmatter.tags.some((tag: string) => koreanTagRegex.test(tag));
      
      if (hasKoreanTags) {
        translatedFrontmatter.tags = await Promise.all(
          frontmatter.tags.map(async (tag: string) => {
            if (koreanTagRegex.test(tag)) {
              return await service.translate(tag, sourceLocale, targetLocale);
            }
            return tag;
          })
        );
      }
    }
    
    // Translate content
    const translatedContent = await service.translate(content, sourceLocale, targetLocale);
    
    // Create translated file with frontmatter
    const translatedFile = matter.stringify(translatedContent, translatedFrontmatter);
    
    // Ensure target directory exists
    const targetDir = path.dirname(targetPath);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    
    // Write translated file
    fs.writeFileSync(targetPath, translatedFile);
    console.log(`Successfully translated ${sourcePath} to ${targetPath}`);
  } catch (error) {
    console.error(`Error translating ${sourcePath}:`, error);
    throw error;
  }
}

// Function to translate JSON content
async function translateJsonContent(
  sourcePath: string,
  targetPath: string,
  service: TranslationService,
  sourceLocale: string,
  targetLocale: string
): Promise<void> {
  try {
    console.log(`Translating ${sourcePath} to ${targetPath}`);
    
    // Read source file
    const source = fs.readFileSync(sourcePath, 'utf8');
    const data = JSON.parse(source);
    
    // Check if target file exists and has manualTranslation flag
    let existingManualTranslation = false;
    if (fs.existsSync(targetPath)) {
      try {
        const targetContent = fs.readFileSync(targetPath, 'utf8');
        const targetData = JSON.parse(targetContent);
        existingManualTranslation = targetData.manualTranslation === true;
      } catch (error) {
        // Ignore errors
      }
    }
    
    // Deep clone the data
    const translatedData = JSON.parse(JSON.stringify(data));
    
    // Preserve manualTranslation flag if it was set
    if (existingManualTranslation) {
      translatedData.manualTranslation = true;
    }
    
    // Translate specific fields based on content type
    if (path.dirname(sourcePath).includes('authors')) {
      // Author fields to translate
      if (data.name) {
        translatedData.name = await service.translate(data.name, sourceLocale, targetLocale);
      }
      
      if (data.bio) {
        translatedData.bio = await service.translate(data.bio, sourceLocale, targetLocale);
      }
      
      if (data.role) {
        translatedData.role = await service.translate(data.role, sourceLocale, targetLocale);
      }
    } else if (path.dirname(sourcePath).includes('products')) {
      // Product fields to translate
      if (data.name) {
        translatedData.name = await service.translate(data.name, sourceLocale, targetLocale);
      }
      
      if (data.description) {
        translatedData.description = await service.translate(data.description, sourceLocale, targetLocale);
      }
      
      if (data.features && Array.isArray(data.features)) {
        translatedData.features = await Promise.all(
          data.features.map(async (feature: string) => {
            return await service.translate(feature, sourceLocale, targetLocale);
          })
        );
      }
    }
    
    // Ensure target directory exists
    const targetDir = path.dirname(targetPath);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    
    // Write translated file
    fs.writeFileSync(targetPath, JSON.stringify(translatedData, null, 2));
    console.log(`Successfully translated ${sourcePath} to ${targetPath}`);
  } catch (error) {
    console.error(`Error translating ${sourcePath}:`, error);
    throw error;
  }
}

// Main function to process content translation
async function translateContent(config: TranslationConfig): Promise<void> {
  const { sourceLocale, targetLocale, contentType } = config;
  
  // Create translation service
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is not set');
  }
  
  const service = new OpenAITranslationService(apiKey);
  
  // Define content directory
  const contentDir = path.join(process.cwd(), 'src/content', contentType);
  
  // Check if directory exists
  if (!fs.existsSync(contentDir)) {
    console.error(`Content directory not found: ${contentDir}`);
    return;
  }
  
  // Get all files in the directory
  const files = fs.readdirSync(contentDir);
  
  // Filter files by source locale
  const sourceFiles = files.filter(file => file.includes(`.${sourceLocale}.`));
  
  // Process each file
  for (const file of sourceFiles) {
    const sourcePath = path.join(contentDir, file);
    const targetFile = file.replace(`.${sourceLocale}.`, `.${targetLocale}.`);
    const targetPath = path.join(contentDir, targetFile);
    
    // Check if target file already exists
    if (fs.existsSync(targetPath)) {
      // For MDX files, check if they have manualTranslation flag
      if (targetPath.endsWith('.mdx')) {
        try {
          const targetContent = fs.readFileSync(targetPath, 'utf8');
          const { data: targetFrontmatter } = matter(targetContent);
          
          // Skip translation if manualTranslation is true
          if (targetFrontmatter.manualTranslation === true) {
            console.log(`Skipping ${file} as it's marked as manual translation`);
            continue;
          }
        } catch (error) {
          console.error(`Error reading target file ${targetPath}:`, error);
        }
      }
      
      // For JSON files, check if they have manualTranslation flag
      if (targetPath.endsWith('.json')) {
        try {
          const targetContent = fs.readFileSync(targetPath, 'utf8');
          const targetData = JSON.parse(targetContent);
          
          // Skip translation if manualTranslation is true
          if (targetData.manualTranslation === true) {
            console.log(`Skipping ${file} as it's marked as manual translation`);
            continue;
          }
        } catch (error) {
          console.error(`Error reading target file ${targetPath}:`, error);
        }
      }
      
      // Skip if target file is newer than source file (fallback)
      const sourceStats = fs.statSync(sourcePath);
      const targetStats = fs.statSync(targetPath);
      
      if (targetStats.mtime > sourceStats.mtime) {
        console.log(`Skipping ${file} as target is newer than source`);
        continue;
      }
    }
    
    // Process based on file extension
    if (file.endsWith('.mdx')) {
      await translateMdxContent(sourcePath, targetPath, service, sourceLocale, targetLocale);
    } else if (file.endsWith('.json')) {
      await translateJsonContent(sourcePath, targetPath, service, sourceLocale, targetLocale);
    } else {
      console.log(`Skipping unsupported file type: ${file}`);
    }
  }
}

// CLI entry point
async function main() {
  try {
    // Default configuration
    const config: TranslationConfig = {
      sourceLocale: 'ko',
      targetLocale: 'en',
      contentType: 'posts',
    };
    
    // Parse command line arguments
    for (let i = 2; i < process.argv.length; i++) {
      const arg = process.argv[i];
      
      if (arg === '--source' || arg === '-s') {
        config.sourceLocale = process.argv[++i];
      } else if (arg === '--target' || arg === '-t') {
        config.targetLocale = process.argv[++i];
      } else if (arg === '--content' || arg === '-c') {
        const contentType = process.argv[++i] as ContentType;
        if (!['posts', 'products', 'authors'].includes(contentType)) {
          throw new Error(`Invalid content type: ${contentType}. Must be one of: posts, products, authors`);
        }
        config.contentType = contentType;
      }
    }
    
    console.log('Starting translation with config:', config);
    
    // Translate content
    await translateContent(config);
    
    console.log('Translation completed successfully');
  } catch (error) {
    console.error('Translation failed:', error);
    process.exit(1);
  }
}

// Run the script
main();