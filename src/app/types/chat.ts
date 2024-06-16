export enum ChatDataType {
  TOPIC_CAROUSEL = "TOPIC_CAROUSEL",
  TEXT_MESSAGE = "TEXT_MESSAGE",
  COINS_LIST = "COINS_LIST",
  COIN_PRICE = "COIN_PRICE",
  DATA_LIST = "DATA_LIST",
}

export enum ChatSource {
  USER = "USER",
  WAGMI_AI = "WAGMI_AI",
}

export type ChatItem = {
  source: ChatSource;
  type: ChatDataType;
  data: any;
};

export type AssetPrice = {
  name: string;
  price: number;
  oneDayChange: number; // in %
  icon: string | null;
  unit: string;
};

export type CHATCoinListData = {
  title: string;
  items: AssetPrice[];
};

export type CHATCoinPriceData = {
  title: string;
  asset: AssetPrice;
};

export type CHATDataListData = {
  title: string;
  items: {
    title: string;
    description: string;
  }[];
};

export enum THREAD_TYPE {
  DISCUSS = "DISCUSS",
  EXPLAIN = "EXPLAIN",
}
