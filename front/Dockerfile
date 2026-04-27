# Multi-stage build for React app
FROM node:18-alpine as build

# 작업 디렉토리 설정
WORKDIR /app

# 환경변수 설정
ARG REACT_APP_AWS_REGION=ap-northeast-2
ARG REACT_APP_USER_POOL_ID=ap-northeast-2_3KZ5195Hb
ARG REACT_APP_USER_POOL_CLIENT_ID=1hvpamheshqu2mrsstb95oftto
ARG REACT_APP_KAKAO_JAVASCRIPT_KEY=
ENV REACT_APP_AWS_REGION=$REACT_APP_AWS_REGION
ENV REACT_APP_USER_POOL_ID=$REACT_APP_USER_POOL_ID
ENV REACT_APP_USER_POOL_CLIENT_ID=$REACT_APP_USER_POOL_CLIENT_ID
ENV REACT_APP_KAKAO_JAVASCRIPT_KEY=$REACT_APP_KAKAO_JAVASCRIPT_KEY

# package.json과 package-lock.json 복사
COPY package*.json ./

# 의존성 설치
RUN npm ci

# 소스 코드 복사
COPY . .

# React 앱 빌드
RUN npm run build

# Production stage with Nginx
FROM nginx:alpine

# Nginx 설정 파일 복사
COPY nginx.conf /etc/nginx/nginx.conf

# 빌드된 React 앱을 Nginx로 복사
COPY --from=build /app/build /usr/share/nginx/html

# 포트 80 노출
EXPOSE 80

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]
