// scripts/generate-hash.js
import bcrypt from 'bcryptjs';
// const bcrypt = require('bcryptjs');

async function generateHash() {
  const password = 'admin123';
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  
  console.log('Password:', password);
  console.log('Hash:', hash);
  console.log('\nSalin hash ini ke ADMIN_CREDENTIALS.password_hash di lib/auth.ts');
}

generateHash();