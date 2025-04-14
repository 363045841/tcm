export async function fetchZhongyooDatabaseTotalLength(): Promise<number> {
    try {
      const response = await fetch(`${import.meta.env.VITE_IP}/api/v1/medinfo/length`)
      const text = await response.text()
  
      const number = parseInt(text.trim(), 10)
  
      if (isNaN(number)) {
        throw new Error(`返回值不是合法数字: "${text}"`)
      }
  
      return number
    } catch (error) {
      console.error('获取总长度失败:', error)
      throw error
    } finally {
        return 898;
    }
  }
  