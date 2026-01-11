import axios from 'axios';
import Cookies from 'js-cookie';
import config from './config';

const serverPath = config.API_URL;

export const request = async (path, data, method) => {
    try {
        let loginData = Cookies.get('Inventory_Management') ? JSON.parse(Cookies.get('Inventory_Management')) : null;
        const accessToken = loginData?.token;
        const refreshToken = loginData?.refreshToken;

        const axiosOptions = {
            method,
            url: `${serverPath}/${path}`,
            headers: {
                "Content-Type": "application/json",
                Authorization: accessToken ? `Bearer ${accessToken}` : "",
            },
        };

        if (method === "GET") {
            axiosOptions.params = data;
        } else {
            axiosOptions.data = data;
        }

        const response = await axios(axiosOptions);
        return response.data;

    } catch (error) {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            const loginData = Cookies.get('Inventory_Management') ? JSON.parse(Cookies.get('Inventory_Management')) : null;
            const refreshToken = loginData?.refreshToken;

            if (!refreshToken) {
                Cookies.remove('Inventory_Token');
                Cookies.remove('Inventory_Management');
                window.location.href = "/login";
                return;
            }

            try {
                const refreshRes = await axios.post(`${serverPath}/auth/refresh-token`, { refreshToken });
                if (refreshRes.data.success) {
                    const newLoginData = {
                        ...loginData,
                        token: refreshRes.data.data.token,
                        refreshToken: loginData.refreshToken, 
                    };
                    Cookies.set('Inventory_Management', JSON.stringify(newLoginData));

                    return request(path, data, method);
                } else {
                    throw new Error("Refresh token failed");
                }
            } catch (refreshErr) {
                Cookies.remove('Inventory_Token');
                Cookies.remove('Inventory_Management');
                window.location.href = "/login";
                return;
            }
        }

        throw error;
    }
};


export const postRequest = async (path, data) => await request(path, data, 'POST');
export const putRequest = async (path, data) => await request(path, data, 'PUT');
export const PatchRequest = async (path, data) => await request(path, data, 'PATCH');
export const deleteRequest = async (path, data) => await request(path, data, 'DELETE');
export const getRequest = async (path, data) => await request(path, data, 'GET');
