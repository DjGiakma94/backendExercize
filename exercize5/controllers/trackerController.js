let Users = []

exports.createNewUser = async (req, res) => {
    if(!req.body) return res.status(400).json({ error: 'body'});
    
    
    let newUser = req.body;
    Users.push(newUser);

    res.status(201).json({
      status: "success",
      data: {
        user: newUser,
      },
    });
  };

exports.getAllUsers = (req, res) => {
  if( Users.length === 0 ){
    res.status(400).json
    ({ error: 'no user found'});
  };

  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    results: Users.length,
    data: {
      Users,
    },
  });
};

exports.addExercise = (req, res) => {
  //implement here
}