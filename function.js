export const handler = async(event) => {
    // TODO implement
    console.log(event);
    const msg = "Naveen says " + event.queryStringParameters['keyword'];
    const response = {
        statusCode: 200,
        body: msg,
    };
    return response;
};
