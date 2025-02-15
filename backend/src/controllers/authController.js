const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://xyzcompany.supabase.co', 'public-anon-key');

const register = async (req, res) => {
  const { email, password } = req.body;
  const { user, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return res.status(400).json({ message: error.message });
  }

  res.status(201).json(user);
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const { user, error } = await supabase.auth.signIn({ email, password });

  if (error) {
    return res.status(400).json({ message: error.message });
  }

  res.status(200).json(user);
};

module.exports = { register, login };