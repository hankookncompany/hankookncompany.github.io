import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const CONTENT_DIR = path.join(process.cwd(), 'src/content');
const POSTS_DIR = path.join(CONTENT_DIR, 'posts');

console.log('🧪 Testing MDX Content Management System');
console.log('=====================================');

// Test 1: Check if content directories exist
console.log('\n1. Testing directory structure...');
const dirs = ['posts', 'products', 'authors'];
dirs.forEach(dir => {
    const dirPath = path.join(CONTENT_DIR, dir);
    const exists = fs.existsSync(dirPath);
    console.log(`   ${dir}/: ${exists ? '✅' : '❌'}`);
});

// Test 2: Test MDX parsing
console.log('\n2. Testing MDX parsing...');
if (fs.existsSync(POSTS_DIR)) {
    const files = fs.readdirSync(POSTS_DIR);
    const mdxFiles = files.filter(file => file.endsWith('.mdx'));

    console.log(`   Found ${mdxFiles.length} MDX files`);

    mdxFiles.forEach(file => {
        try {
            const filePath = path.join(POSTS_DIR, file);
            const fileContent = fs.readFileSync(filePath, 'utf8');
            const { data: frontmatter, content } = matter(fileContent);

            console.log(`   📄 ${file}:`);
            console.log(`      Title: ${frontmatter.title}`);
            console.log(`      Author: ${frontmatter.author}`);
            console.log(`      Tags: ${frontmatter.tags?.join(', ')}`);
            console.log(`      Content length: ${content.length} chars`);
            console.log(`      Status: ✅ Parsed successfully`);
        } catch (error) {
            console.log(`   📄 ${file}: ❌ Parse error - ${error.message}`);
        }
    });
} else {
    console.log('   ❌ Posts directory not found');
}

// Test 3: Test JSON content parsing
console.log('\n3. Testing JSON content parsing...');
['products', 'authors'].forEach(type => {
    const typeDir = path.join(CONTENT_DIR, type);
    if (fs.existsSync(typeDir)) {
        const files = fs.readdirSync(typeDir);
        const jsonFiles = files.filter(file => file.endsWith('.json'));

        console.log(`   ${type}: Found ${jsonFiles.length} JSON files`);

        jsonFiles.forEach(file => {
            try {
                const filePath = path.join(typeDir, file);
                const fileContent = fs.readFileSync(filePath, 'utf8');
                const data = JSON.parse(fileContent);

                console.log(`   📄 ${file}: ✅ Valid JSON (${Object.keys(data).length} properties)`);
            } catch (error) {
                console.log(`   📄 ${file}: ❌ Parse error - ${error.message}`);
            }
        });
    } else {
        console.log(`   ${type}: ❌ Directory not found`);
    }
});

console.log('\n✨ Content Management System Test Complete!');