DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS posts;

CREATE TABLE posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  author TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TEXT NOT NULL
);

INSERT INTO posts (id, title, author, content, created_at) VALUES
  (1, '게시판 프로젝트 시작합니다', '관리자', '오늘부터 이 게시판에서 자유롭게 글을 남겨주세요. 잘 부탁드립니다!', '2026-08-18T11:00:00'),
  (2, 'Vite로 개발 환경 세팅하기', '이수민', 'CRA 대신 Vite를 사용해서 개발 서버를 띄우니 HMR 속도가 체감될 정도로 빨라졌습니다. 설정 방법을 공유합니다.', '2026-08-19T15:10:00'),
  (3, 'React 19 새로운 기능 정리', '김민준', 'React 19에서 추가된 useActionState, useOptimistic 훅과 새로운 컴파일러에 대해 정리해봤습니다. 실무에 적용하면서 느낀 점도 함께 공유합니다.', '2026-08-20T09:30:00');

INSERT INTO comments (post_id, author, content, created_at) VALUES
  (1, '김민준', '잘 부탁드립니다!', '2026-08-18T11:20:00'),
  (3, '이수민', '정리 잘 봤습니다! useOptimistic 예제 코드도 궁금하네요.', '2026-08-20T10:05:00');
