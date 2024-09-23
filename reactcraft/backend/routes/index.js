import express from 'express';
const router = express.Router();

router.get('/', (req, res, next) => {
  res.status(200).json({
    title: '서버가 실행 중입니다.'
  })
});

export default router;