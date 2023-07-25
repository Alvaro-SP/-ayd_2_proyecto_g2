export const auth = {
    headers: {
        'Authorization': "Bearer " + sessionStorage.getItem("auth"),
    },
};