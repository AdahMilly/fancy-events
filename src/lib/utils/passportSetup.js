import passport from 'passport';
import EncryptData from '../helpers/encrypt';
import CustomError from './customError';
import { getConfig } from '../../config';
import { usersResource } from '../../domains/users/users.resource';

const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { Strategy: LocalStrategy } = require('passport-local');

const config = getConfig();

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        const user = await usersResource.getUser('email', email);
        if (!user) throw new CustomError(400, 'Wrong email or password');
        const passwordMatch = await EncryptData.compareHash(
          password,
          user.password,
        );
        if (!passwordMatch) {
          throw new CustomError(400, 'Wrong email or password');
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    },
  ),
);
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.secretKey,
      jsonWebTokenOptions: { maxAge: config.jwtExpiration },
    },
    (jwtPayload, done) => done(null, jwtPayload),
  ),
);

const localAuthentication = passport.authenticate('local', {
  session: false,
});

const jwtAuthentication = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) throw new CustomError(401, 'please login to continue');
    req.user = user;
    next();
  })(req, res, next);
};
export { localAuthentication, jwtAuthentication };