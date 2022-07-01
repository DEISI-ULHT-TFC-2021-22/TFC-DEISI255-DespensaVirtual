export interface IProducts {
    _id?: string;
    user_id?: string;
    produto?: string;
    quantidade?: Number;
    validade?: Number;
    categoria?: string;
    lista_compras?: boolean;
    __v?: Number;
  }
  
  export class Products implements IProducts {
    constructor(
      public id?: string,
      public user_id?: string,
      public produto?: string,
      public quantidade?: Number,
      public validade?: Number,
      public categoria?: string,
      public lista_compras?: boolean,
      public __v?: Number
    ) {}
  }



//Nome de tabelas sao no singular