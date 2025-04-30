// 发送请求并处理流式响应
async function startStream() {
  const url = "http://localhost:3001/api/v1/chat/stream"; // 目标 URL

  const headers = {
    Host: "www.tcmip.cn:18124",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
    Accept: "application/json, text/plain, */*",
    "Accept-Encoding": "gzip, deflate",
    "Content-Type": "application/json;charset=UTF-8",
    "Accept-Language": "zh-CN,zh;q=0.9",
    DNT: "1",
    Origin: "http://www.tcmip.cn",
    Referer: "http://www.tcmip.cn/",
  };

  const body = JSON.stringify({
    message: "我头昏",
    conversation_id: "cf9c7310-9096-4e40-b932-b1ca75b324ad",
  });

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: body,
    });

    // 检查响应是否成功
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // 处理流式响应
    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let tempPkg = "";

    // 处理数据流
    reader.read().then(function processText({ done, value }) {
      if (done) {
        console.log("Stream finished");
        return;
      }

      // 解码当前数据块并附加到临时包
      const chunk = decoder.decode(value, { stream: true });
      tempPkg += chunk;

      // 打印或处理数据块
      console.log("Received chunk:", chunk);

      // 继续读取下一个数据块
      reader.read().then(processText);
    });
  } catch (error) {
    console.error("Request failed:", error);
  }
}

// 调用函数开始流式请求
startStream();
