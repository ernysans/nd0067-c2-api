import {NextFunction, Request, Response} from "express";
import jwt from "jsonwebtoken";
import {User, UserStore} from "./models/user";

const userStore = new UserStore();
export const getToken = (request: Request) => {
  let token: string | null = null;
  if (!request.headers.authorization) throw new Error('Unauthorized. Token is missing');
  token = request.headers.authorization.split(' ')[1];
  return token && token.length > 20 ? token : null;
};

export const decodeToken = (token: string) => {
  return jwt.decode(token, {
    json: true,
  });
}

/**
 * Return User object from token
 * @param request
 * @return User
 */
export const userFromToken = (request: Request): User => {
  const decoded = decodeToken(getToken(request));
  if (!decoded) throw new Error('Unauthorized. Token is invalid');
  if (decoded['user'] === undefined) throw new Error('Unauthorized. Token is invalid, the user is not found.');
  return decoded['user'] as User;
}

export const verifyAuthToken = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const token = getToken(request);
    jwt.verify(token, process.env.TOKEN_SECRET);
    /// Check if user data is on the token
    const user = userFromToken(request);
    if (!user) throw new Error('Unauthorized. User not found');
    /// Check if user exists in the database
    await userStore.show(user.id);
    next();
  } catch (error) {
    response.status(401).json({error: 'Unauthorized'});
  }
}

const _formatError = (error: any) => {
  const responseMessage: any = {
    title: error.name || 'error',
    message: error.message,
    status: error.statusCode || 400,
  };
  responseMessage.source = error.stack || '';
  if (
    error.name === 'UnauthorizedError' ||
    error.message === 'UnauthorizedError'
  ) {
    responseMessage.title = 'UnauthorizedError';
    responseMessage.message = responseMessage.message || 'Invalid token';
    responseMessage.status = 401;
  }
  responseMessage.error = responseMessage.title;
  responseMessage.error_description = responseMessage.message;
  switch (responseMessage.status) {
    case 404:
      responseMessage.title = 'Not found';
      break;
  }
  return responseMessage;
};

export const middlewareErrorAPI = (error: string, request: Request, response: Response, next: NextFunction) => {
  if (error) {
    const responseMessage = _formatError(error);
    response.set('Cache-Control', 'no-cache, no-store');
    response.status(responseMessage.status).json(responseMessage);
  } else {
    next(null);
  }
};
