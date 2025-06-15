import ApiResponse from "@/interface/common/ApiResponse";

type ServerParams = {
  withAuth?: boolean;
  spName: string;
  mode: number;
  token?: string;
};

export default class Server {
  private uri: string;
  private withAuth: boolean;
  private token?: string;
  private reqBody: any;
  // let reqBody: any
  
  constructor(params: ServerParams) {
    this.uri = !!params.withAuth
    ? `${process.env.NEXT_PUBLIC_ENDPOINT_URL}/AuthDataGet/ExecuteJson/${params.spName}/${params.mode}`
    : `${process.env.NEXT_PUBLIC_ENDPOINT_URL}/AnonymousDataGet/ExecuteJson/${params.spName}/${params.mode}`;
    
    this.withAuth = !!params.withAuth;
    this.token = params.token;
    // this.reqBody = {};
  }

  async request(reqBody?: any): Promise<ApiResponse> {
    this.reqBody = reqBody ?? {};
    const res = await fetch(this.uri, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(this.withAuth && {
          Authorization: `Bearer ${this.token}`,
        }),
      },
      body: JSON.stringify(this.reqBody),
    });
    return res.json();
  }

  async refetch(): Promise<ApiResponse> {  
    return await this.request(this.reqBody);
  }
}
