import api from './api';

interface UserListProp {
  user_id: string;
  jwt_token: string;
}

type UserReturn = {
  phone: string;
  user_id: string;
  user_fullname: string;
  user_email: string;
};

interface UserListResponse {
  statusCode: string;
  userResp: UserReturn[];
}

export async function listUsers({
  user_id,
  jwt_token,
}: UserListProp): Promise<UserListResponse> {
  let statusCode = '';
  let userResp: UserReturn[] = [];

  const userParams = {
    user_id: user_id,
  };

  try {
    const userListResponse = await api.get('api/v1/getUserList', {
      params: userParams,
      headers: { Authorization: `Bearer ${jwt_token}` },
    });
    statusCode = userListResponse.status.toString();
    userResp = userListResponse.data.data;
    return { statusCode, userResp };
  } catch (error) {
    console.log('error while fetching users list', error);
    return { statusCode, userResp };
  }
}
