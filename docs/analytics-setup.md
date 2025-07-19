# Google Analytics 설정 가이드

이 가이드는 팀 기술 블로그에서 Google Analytics 4(GA4)를 설정하는 방법을 설명합니다.

## 사전 요구사항

1. Google Analytics 계정 생성 (https://analytics.google.com)
2. 새 GA4 속성 생성

## 설정 단계

### 1. Google Analytics 속성 설정

1. Google Analytics 계정에 로그인
2. 새 속성 생성 (GA4)
3. 웹 스트림 설정 (블로그 URL 입력)
4. 측정 ID 확인 (G-XXXXXXXXXX 형식)

### 2. 환경 변수 구성

1. `.env.local` 파일에 측정 ID 추가:

```
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

2. 프로덕션 배포를 위해 호스팅 플랫폼(GitHub Pages, Vercel, Netlify 등)에서 이 환경 변수를 설정하세요.

3. 개발 중에는 분석을 비활성화하는 것이 좋습니다:
```
NEXT_PUBLIC_ENABLE_GA_IN_DEV=false
```

### 3. 분석 테스트

#### 수동 테스트

Google Analytics 추적이 작동하는지 확인하려면:

1. 개발 서버 실행: `npm run dev`
2. 브라우저에서 블로그 페이지 방문
3. Google Analytics 실시간 보고서 확인
4. 이벤트가 기록되는지 확인

#### 브라우저 개발자 도구 사용

1. 브라우저 개발자 도구 열기
2. 네트워크 탭으로 이동
3. `google-analytics.com` 또는 `gtag` 필터링
4. 사이트를 탐색하고 GA 요청이 발생하는지 확인
5. 이러한 요청에 대해 성공적인 응답(상태 200)이 표시되어야 함

### 4. 분석 옵트아웃

사용자는 두 가지 방법으로 분석 추적을 옵트아웃할 수 있습니다:

1. 프로그래밍 방식: 브라우저에서 `localStorage.setItem('ga-opt-out', 'true')` 설정

2. 제공된 UI 컴포넌트 사용:
   ```tsx
   import { AnalyticsOptOut } from '@/components/analytics/AnalyticsOptOut';
   
   // 개인정보 설정 페이지에서:
   <AnalyticsOptOut 
     labels={{
       title: "분석 추적",
       description: "블로그 개선을 위해 익명의 사용 데이터를 수집합니다. 개인 정보는 수집되지 않습니다.",
       enabled: "활성화",
       disabled: "비활성화",
       save: "설정 저장"
     }}
   />
   ```

이 컴포넌트는 사용자에게 데이터 제어 권한을 제공하기 위해 개인정보 설정 또는 쿠키 동의 페이지에 추가해야 합니다.

### 5. 개발 모드

개발 중에는 다음 설정으로 분석 추적을 비활성화할 수 있습니다:

```
NEXT_PUBLIC_ENABLE_GA_IN_DEV=false
```

## 분석 데이터 구조

분석 시스템은 다음 이벤트를 추적합니다:

- `page_view`: 사용자가 페이지를 방문할 때
- `time_spent`: 사용자가 페이지를 떠날 때(체류 시간 포함)
- `click`: 사용자가 추적된 요소를 클릭할 때
- `scroll`: 사용자가 특정 깊이(25%, 50%, 75%, 100%)까지 스크롤할 때

## 분석 확장

추가 이벤트를 추적하려면:

1. 분석 라이브러리 가져오기:
```typescript
import { trackEvent } from '@/lib/analytics';
```

2. 사용자 정의 이벤트 추적:
```typescript
trackEvent('custom_event', {
  // 사용자 정의 데이터
  action: 'button_click',
  label: 'signup_button'
});
```

## 개인정보 보호 고려사항

- 분석 시스템은 다음과 같은 방법으로 사용자 개인정보를 존중합니다:
  - 사용자가 옵트아웃할 수 있도록 함
  - 개인 식별 정보를 수집하지 않음
  - IP 주소 익명화 사용
  - Do Not Track 설정 존중

## 문제 해결

### 분석이 작동하지 않는 경우

분석 이벤트가 기록되지 않는 경우 다음을 확인하세요:

1. **환경 변수**: `.env.local` 파일 또는 배포 환경에 `NEXT_PUBLIC_GA_MEASUREMENT_ID`가 올바르게 설정되어 있는지 확인하세요.

2. **브라우저 콘솔**: Google Analytics 또는 분석과 관련된 오류가 있는지 브라우저 콘솔을 확인하세요.

3. **분석 비활성화**: 다음을 통해 분석이 비활성화되었는지 확인하세요:
   - 환경에서 `NEXT_PUBLIC_ENABLE_GA_IN_DEV=true`
   - 사용자가 `localStorage.getItem('ga-opt-out') === 'true'`를 통해 옵트아웃함

### 일반적인 오류

#### "Google Analytics Measurement ID not found"

이 오류는 Google Analytics 측정 ID 환경 변수가 설정되지 않았을 때 발생합니다. 다음을 확인하세요:

1. `.env.local` 파일에 올바른 값이 있는지 확인
2. 배포 플랫폼에 환경 변수가 올바르게 설정되어 있는지 확인
3. 올바른 변수 이름 사용: `NEXT_PUBLIC_GA_MEASUREMENT_ID`