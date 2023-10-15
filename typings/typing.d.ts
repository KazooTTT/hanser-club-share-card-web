interface PostData {
  code: number;
  info: PostDataInfo;
}

interface PostDataInfo {
  id: number;
  title: string;
  content: string;
  type: number;
  auth: number;
  authentication: string;
  post_time: string;
  likes: number;
  replies: number;
  readings: number;
  location: string;
  isp: string;
  showLocation: number;
  status: number;
  pictures: string[];
  primaryPictures: string[];
  tags: string[];
  valued: boolean;
  top: boolean;
  labels: string[];
  author: {
    uid: number;
    nickname: string;
    avatar: string;
    role: number;
    status: number;
    exp: number;
    auth: number;
    authentication: string;
    focusHe: boolean;
  };
  liked: boolean;
  favorite: boolean;
}
