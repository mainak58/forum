export default interface TblAnswerAttachment {
  localId?: number;
  AttachmentId?: number;
  AnswerId?: number;
  AttachmentType?: "Internal" | "External";
  DocumentId?: number;
  ExternalUrl?: string;
  IsDeleted?: boolean;
  IsSaved?: boolean;
}
