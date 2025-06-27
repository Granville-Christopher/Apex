const isLogin = async (req, res, next) => {
  try {
    if (req.session.user) {
      next();
    } else {
      res.redirect('/');
    }
  } catch (err) {
    console.log(err.message);
    res.redirect('/');
  }
};

const isLogout = async (req, res, next) => {
  try {
    if (req.session.user) {
      return res.redirect('/dashboard');
    }
    next();
  } catch (err) {
    console.log(err.message);
    res.redirect('/');
  }
};


const isAdminLogin = async (req, res, next) => {
  try {
    if (req.session.admin) {
      next();
    } else {
      res.redirect('/admin/login');
    }
  } catch (err) {
    console.log(err.message);
    res.redirect('/admin/');
  }
};


const isAdminLogout = async (req, res, next) => {
  try {
    if (req.session.admin) {
      return res.redirect('/admin/');
    }
    next();
  } catch (err) {
    console.log(err.message);
    res.redirect('/admin/');
  }
};


module.exports = {
    isLogin,
    isLogout,
    isAdminLogin,
    isAdminLogout
}
