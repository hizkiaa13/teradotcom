module.exports = function handler(req, res) {
  res.status(200).json({ 
    ok: true, 
    msg: 'Serverless function is running!',
    dbUrl: process.env.DATABASE_URL ? 'SET' : 'NOT SET'
  });
};
