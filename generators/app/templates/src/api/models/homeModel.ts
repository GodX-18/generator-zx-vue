export interface loginParams {
  ticket: string;
  declarebm: string;
  declareid: string;
}

export interface businessInfoParams {
  //* 变更declareid=TE320590XXX4266180400011701500003
  //* 延期declareid=TE320590XXX4266180400011701500002
  //* 核发declareid=TE320590XXX4266180400011701500001
  declareid: string;
  applyId?: string;
  corname?: string;
}

export interface dialogSaveParams {
  id: string;
  name: string;
  value: string;
}
