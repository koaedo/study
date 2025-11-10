# 🔧 Git 계정 관리 가이드

> 회사 계정과 개인 계정을 프로젝트별로 분리하여 관리하는 방법

---

## 📋 목차
1. [Git 계정 관리 개념](#1-git-계정-관리-개념)
2. [로컬 저장소별 설정 방법 (추천)](#2-로컬-저장소별-설정-방법-추천)
3. [SSH 키를 이용한 방법](#3-ssh-키를-이용한-방법)
4. [Git Credential Manager 활용](#4-git-credential-manager-활용)
5. [실전 워크플로우](#5-실전-워크플로우)

---

## 1. Git 계정 관리 개념

### Git의 두 가지 설정 레벨
Git은 3가지 레벨의 설정을 가지고 있습니다:
- `--system`: 시스템 전체 설정 (거의 사용 안 함)
- `--global`: 사용자 전체 설정 (모든 저장소에 적용)
- `--local`: 특정 저장소만의 설정 (해당 프로젝트에만 적용)

**핵심**: `--local` 설정이 `--global` 설정보다 우선순위가 높습니다!

### 현재 설정 확인
```bash
# 전역 설정 확인
git config --global user.name
git config --global user.email

# 현재 저장소의 설정 확인 (로컬)
git config user.name
git config user.email

# 모든 설정 보기
git config --list
```

---

## 2. 로컬 저장소별 설정 방법 (추천) ⭐

이 방법이 **가장 간단하고 확실**합니다!

### Step 1: 전역 설정 (회사 계정)
회사에서 주로 작업하므로, 전역 설정을 회사 계정으로 설정합니다.

```bash
# Windows PowerShell 또는 CMD
git config --global user.name "회사이름"
git config --global user.email "company@work.com"
```

### Step 2: 개인 프로젝트 저장소 설정
개인 프로젝트(Three.js 학습 등)는 저장소마다 로컬 설정을 해줍니다.

```bash
# 프로젝트 폴더로 이동
cd D:\study

# Git 저장소 초기화 (아직 안 했다면)
git init

# 이 저장소에만 적용되는 개인 계정 설정
git config user.name "개인이름"
git config user.email "personal@gmail.com"

# 설정 확인
git config user.name
git config user.email
```

### Step 3: 확인하기
```bash
# 현재 저장소 설정 확인 (개인 계정이어야 함)
cd D:\study
git config user.name
git config user.email

# 회사 프로젝트로 이동
cd D:\work-project
git config user.name  # 회사 계정이 나와야 함
```

### 장점
- ✅ 설정이 매우 간단
- ✅ 실수로 잘못된 계정으로 커밋할 위험 낮음
- ✅ 각 프로젝트마다 명확한 계정 분리

---

## 3. SSH 키를 이용한 방법

SSH 키를 사용하면 계정별로 자동으로 인증됩니다.

### Step 1: SSH 키 생성

```bash
# 개인 계정용 SSH 키 생성
ssh-keygen -t ed25519 -C "personal@gmail.com" -f ~/.ssh/id_ed25519_personal

# 회사 계정용 SSH 키 생성
ssh-keygen -t ed25519 -C "company@work.com" -f ~/.ssh/id_ed25519_work
```

### Step 2: SSH Config 파일 설정

`~/.ssh/config` 파일을 생성/수정합니다. (Windows: `C:\Users\YourName\.ssh\config`)

```bash
# 개인 GitHub 계정
Host github-personal
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_personal
    IdentitiesOnly yes

# 회사 GitHub 계정
Host github-work
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_work
    IdentitiesOnly yes
```

### Step 3: GitHub에 SSH 키 등록

```bash
# 개인 계정 SSH 공개키 복사
cat ~/.ssh/id_ed25519_personal.pub

# 회사 계정 SSH 공개키 복사
cat ~/.ssh/id_ed25519_work.pub
```

각각의 GitHub 계정에서:
1. Settings → SSH and GPG keys
2. New SSH key
3. 복사한 공개키 붙여넣기

### Step 4: 저장소 Remote 설정

```bash
# 개인 프로젝트 (D:\study)
cd D:\study
git remote add origin git@github-personal:your-personal-username/threejs-study.git

# 회사 프로젝트
cd D:\work-project
git remote add origin git@github-work:company-org/project-name.git
```

**중요**: `github.com` 대신 `github-personal` 또는 `github-work`를 사용합니다!

---

## 4. Git Credential Manager 활용

Windows에서는 Git Credential Manager가 기본적으로 설치되어 있습니다.

### HTTPS 사용 시 계정 전환

```bash
# 저장된 인증 정보 확인
cmdkey /list | findstr git

# 특정 계정 인증 정보 삭제
cmdkey /delete:git:https://github.com

# 다음 push/pull 시 새로운 계정으로 로그인 프롬프트 표시됨
```

### Personal Access Token (PAT) 사용

GitHub는 비밀번호 대신 PAT를 사용합니다.

1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token
3. 필요한 권한 선택 (repo 전체)
4. 생성된 토큰 복사 (다시 볼 수 없음!)

```bash
# Push 시 비밀번호 대신 PAT 입력
git push origin main
# Username: your-github-username
# Password: ghp_your_personal_access_token
```

---

## 5. 실전 워크플로우

### 🏢 회사에서 개인 프로젝트 작업

```bash
# 1. 개인 프로젝트 폴더로 이동
cd D:\study

# 2. 계정 설정 확인 (개인 계정인지 확인!)
git config user.name
git config user.email

# 3. 작업 후 커밋
git add .
git commit -m "Section 1 학습 완료"

# 4. Push (개인 GitHub 계정으로)
git push origin main
```

### 🏠 집에서 개인 프로젝트 작업

```bash
# 1. 저장소 클론 (최초 1회)
cd D:\
git clone https://github.com/your-personal/threejs-study.git study
cd study

# 2. 로컬 계정 설정 (중요!)
git config user.name "개인이름"
git config user.email "personal@gmail.com"

# 3. 작업 후 커밋
git add .
git commit -m "집에서 Section 2 학습"
git push origin main
```

### ⚠️ 커밋 전 체크리스트

```bash
# 항상 커밋 전에 확인!
echo "=== 현재 Git 설정 ==="
git config user.name
git config user.email
echo "=== 현재 Remote ==="
git remote -v
```

---

## 💡 자동화 스크립트

### check-git.ps1 (PowerShell)
프로젝트 폴더에 저장하고 커밋 전에 실행하세요.

```powershell
# check-git.ps1
Write-Host "=== Git 계정 확인 ===" -ForegroundColor Green
Write-Host "User Name: $(git config user.name)" -ForegroundColor Yellow
Write-Host "User Email: $(git config user.email)" -ForegroundColor Yellow
Write-Host ""
Write-Host "=== Remote 저장소 ===" -ForegroundColor Green
git remote -v
Write-Host ""
Write-Host "=== 현재 브랜치 ===" -ForegroundColor Green
git branch --show-current
```

사용법:
```bash
# PowerShell에서
.\check-git.ps1

# 또는 간단하게
pwsh -File check-git.ps1
```

---

## 🎯 추천하는 최종 설정

### 1단계: 전역 설정 (회사)
```bash
git config --global user.name "회사이름"
git config --global user.email "company@work.com"
```

### 2단계: 개인 프로젝트 초기 설정
```bash
cd D:\study
git init
git config user.name "개인이름"
git config user.email "personal@gmail.com"

# .gitignore 생성
echo "node_modules/" > .gitignore
echo ".DS_Store" >> .gitignore
echo "*.log" >> .gitignore

# README 생성
echo "# Three.js Study" > README.md

# 첫 커밋
git add .
git commit -m "Initial commit: Three.js 학습 프로젝트 시작"
```

### 3단계: GitHub 연결
```bash
# GitHub에서 새 저장소 생성 후
git branch -M main
git remote add origin https://github.com/your-personal/threejs-study.git
git push -u origin main
```

---

## 🚨 문제 해결

### Q1: 잘못된 계정으로 커밋했어요!
```bash
# 마지막 커밋의 작성자 정보만 변경
git commit --amend --reset-author

# 여러 커밋의 작성자 변경 (신중하게!)
git rebase -i HEAD~3  # 최근 3개 커밋
# 'pick'을 'edit'으로 변경 후 저장
# 각 커밋마다:
git commit --amend --reset-author --no-edit
git rebase --continue
```

### Q2: Push가 거부되었어요!
```bash
# 저장된 credential 삭제
cmdkey /delete:git:https://github.com

# 다시 push (새로운 계정으로 로그인)
git push origin main
```

### Q3: 로컬 설정이 안 먹혀요!
```bash
# 설정 우선순위 확인
git config --list --show-origin

# 로컬 설정 강제 적용
cd D:\study
git config --local user.name "개인이름"
git config --local user.email "personal@gmail.com"
```

---

## 📚 추가 참고 자료
- [Git 공식 문서 - Config](https://git-scm.com/docs/git-config)
- [GitHub - Multiple SSH Keys](https://docs.github.com/en/authentication/connecting-to-github-with-ssh)
- [Git Credential Manager](https://github.com/git-ecosystem/git-credential-manager)

---

## ✅ 빠른 체크리스트

새 프로젝트 시작 시:
- [ ] `git config user.name` 확인
- [ ] `git config user.email` 확인
- [ ] `.gitignore` 생성
- [ ] `README.md` 작성
- [ ] 첫 커밋 후 push
- [ ] GitHub에서 커밋 작성자 확인

매일 작업 전:
- [ ] `git config user.name` 다시 확인
- [ ] `git pull` (최신 코드 가져오기)
- [ ] 작업 후 커밋 메시지 명확하게 작성
- [ ] Push 전 한 번 더 확인!

