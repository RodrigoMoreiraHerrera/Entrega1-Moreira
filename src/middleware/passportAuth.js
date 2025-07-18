import passport from "passport";

export const passportCall = (strategy, { required = true } = {}) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, function (err, user, info) {
      if (err) return next(err);
      if (!user && required) {
        return res.status(401).json({
          error: info?.messages ? info.messages : info?.toString() || "No autorizado"
        });
      }
      req.user = user || undefined;
      return next();
    })(req, res, next);
  };
};