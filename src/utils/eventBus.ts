import mitt from "mitt";

type Events = {
  sendRelation: any;
  sendMedName: any;
  clickMedNameGraph: number; // 这里明确指定事件参数是 number
  updateRouterViewKey: void;
  updateRAGCard: any;
};

export const eventBus = mitt<Events>();
