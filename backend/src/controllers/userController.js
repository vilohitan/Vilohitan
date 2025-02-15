const getUserProfile = async (req, res) => {
  const { id } = req.params;
  const supabase = req.app.get('supabase');

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    return res.status(500).json({ message: error.message });
  }

  res.json(data);
};

const updateUserProfile = async (req, res) => {
  const { id } = req.params;
  const supabase = req.app.get('supabase');

  const { data, error } = await supabase
    .from('users')
    .update(req.body)
    .eq('id', id)
    .single();

  if (error) {
    return res.status(500).json({ message: error.message });
  }

  res.json(data);
};

module.exports = { getUserProfile, updateUserProfile };