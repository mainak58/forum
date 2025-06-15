import {TBlCommunityTags} from "./TBlCommunityTags";
import UserRegisterDTO from "./UserRegisterDTO";

export default interface TblQuestion {
  CQId?: number;
  QuestionId?: number;
  QuestionText?: string;
  IsPinned?: boolean;
  IsActive?: boolean;
  IsDeleted?: boolean;
  CreatedBy?: string;
  CreatedOn?: string;
  CreatedIp?: string;
  ModifiedBy?: string;
  ModifiedOn?: string;
  ModifiedIp?: string;
  CreatedUser?: UserRegisterDTO[];
  LikeCount?: number;
  DisLikeCount?: number;
  NoOfReplies?: number;
  LastReplied?: string;
  QuestionTags?: TBlCommunityTags[];
  IsDisLiked?: boolean;
  IsLiked?: boolean;
}
