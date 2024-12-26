import axios from 'axios';
import { type MedicineData } from '@/pages/item/[name].vue'

const api = axios.create({
    baseURL: import.meta.env.VITE_SERVER_IP + '/' + import.meta.env.VITE_BACKEND_PORT,
    timeout: 1000,
});

export const fetchItemData = (id: number) => {
    return api.get(`/api/item/${id}`);
};

// 拦截对/api/item/[id]的GET响应，返回随机生成的mockChineseMedicineData数据
api.interceptors.response.use((response) => {
    console.log("拦截响应:", response);
    const regex = /^\/api\/item\/\d+$/;
    if (regex.test(response.config.url || '')) {
        console.log("模拟返回数据 for /api/item/[id]");

        // 返回模拟数据
        return Promise.resolve({
            data: mockChineseMedicineData,
            status: 200,
            statusText: 'OK',
            headers: response.headers,
            config: response.config,
        });
    }
    return response; // 如果没有匹配到，继续正常响应
}, (error) => {
    console.error("拦截错误:", error);
    return Promise.reject(error);
});

function generateRandomString(length: number) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }
    return result;
}

const mockChineseMedicineData: MedicineData = {
    pic: "/uploads/allimg/131207/1-13120F9504V92.jpg",
    chinese_medicine_name: generateRandomString(10),
    alias: generateRandomString(30),
    english_name: generateRandomString(20),
    source: generateRandomString(50),
    form: generateRandomString(100),
    distribution: generateRandomString(50),
    processing: generateRandomString(100),
    properties: generateRandomString(50),
    efficacy_and_function: generateRandomString(50),
    properties_and_meridian_tropism: generateRandomString(30),
    clinical_application: generateRandomString(100),
    chemical_composition: generateRandomString(100),
    pharmacological_study: generateRandomString(100),
    usage_precautions: generateRandomString(100),
    compatibility_and_prescription: Array.from({ length: 5 }, () => generateRandomString(100)),
};