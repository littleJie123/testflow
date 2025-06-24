import WebSocket from 'ws';
export default class{
  static send(ws: WebSocket, data: any,action:string) {
    try{
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          action,
          result: data
        }));
      } else {
        console.error("WebSocket is not open:",JSON.stringify({
          action,
          result:data
        }));
      }
    } catch (error) {
      console.error("Error sending data through WebSocket:", error);
    }
  }
  
   
}