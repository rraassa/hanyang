# 🚕 남바원 택시 클론

남바원 택시 서비스를 클론한 React 웹 애플리케이션입니다.

## 🚀 기술 스택

- **Frontend**: React 19.1.0, React Router DOM 7.6.3
- **Styling**: Tailwind CSS 3.4.17
- **Build Tool**: Create React App
- **Container**: Docker, Docker Compose
- **Web Server**: Nginx (Production)

## 📁 프로젝트 구조

```
nambaone-taxi-clone/
├── src/
│   ├── components/          # 재사용 가능한 컴포넌트들
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── MainVisual.jsx
│   │   ├── MainCards.jsx
│   │   ├── ReviewSection.jsx
│   │   ├── ListingTable.jsx
│   │   └── InquirySection.jsx
│   ├── pages/              # 페이지 컴포넌트들
│   │   ├── LoginPage.jsx
│   │   ├── SignupPage.jsx
│   │   └── TransferorView.jsx
│   ├── App.js              # 메인 앱 컴포넌트
│   └── index.js            # 앱 진입점
├── public/                 # 정적 파일들
│   └── img/               # 이미지 리소스
├── Dockerfile             # Docker 이미지 빌드 설정
├── nginx.conf             # Nginx 웹서버 설정
├── .dockerignore          # Docker 빌드 제외 파일
└── package.json           # 프로젝트 의존성
```

## 🛠️ 설치 및 실행

### 🚀 빠른 시작 (Docker 권장)

```bash
# 1. 프로젝트 클론
git clone https://github.com/rraassa/hanyang.git
cd hanyang

# 2. Docker로 바로 실행
docker-compose up -d

# 3. 브라우저에서 http://localhost:3000 접속
```

### 로컬 개발 환경

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm start

# 브라우저에서 http://localhost:3000 접속
```

### Docker 명령어

```bash
# 컨테이너 시작
docker-compose up -d

# 컨테이너 중지
docker-compose down

# 로그 확인
docker-compose logs -f frontend

# 컨테이너 재빌드
docker-compose build --no-cache
```

## 🎨 주요 기능

- **반응형 디자인**: 모바일, 태블릿, 데스크톱 지원
- **SPA 라우팅**: React Router를 사용한 페이지 네비게이션
- **인증 시스템**: 로그인/회원가입 페이지 (UI 완성)
- **모던 UI**: Tailwind CSS를 활용한 깔끔한 디자인
- **스크롤 애니메이션**: Intersection Observer를 사용한 헤더 상태 변화

## 🔧 개발 환경 설정

### 필수 요구사항
- Node.js 18+
- npm 또는 yarn
- Docker & Docker Compose (선택사항)

### 환경 변수
현재는 환경 변수가 필요하지 않습니다. 나중에 AWS Cognito 연동 시 환경 변수가 추가될 예정입니다.

## 🚀 배포

### Docker를 사용한 배포
```bash
# 프로덕션 빌드
docker-compose -f docker-compose.prod.yml up -d
```

### 정적 파일 배포
```bash
# 빌드
npm run build

# build 폴더를 웹서버에 배포
```

## 📋 향후 계획

- [ ] **백엔드 API 개발** (Node.js/Express 또는 Python/Django)
- [ ] **AWS Cognito 인증 시스템** 연동
- [ ] **데이터베이스** 연동 (PostgreSQL/MongoDB)
- [ ] **실시간 위치 추적** 기능
- [ ] **결제 시스템** 연동
- [ ] **도메인 연결** 및 SSL 인증서
- [ ] **CI/CD 파이프라인** 구축

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 연락처

프로젝트 링크: [https://github.com/rraassa/hanyang](https://github.com/rraassa/hanyang)

---

**참고**: 이 프로젝트는 학습 목적으로 제작된 클론 프로젝트입니다.
