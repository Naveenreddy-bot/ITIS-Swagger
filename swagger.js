const express = require('express');
var bodyParser = require('body-parser');
const app = express();
const port = 8081;

const mariadb = require('mariadb');
const pool = mariadb.createPool({
        host : 'localhost',
        user : 'root',
        password: 'root',
        port: 3306,
        connectionLimit:5
});

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');

const options = {
    swaggerDefinition :{
        info:{
            title: 'Naveen',
            version: '1.0.0',
            description: 'ITIS 6177'
        },
        host: '67.205.170.159:3000',
        basePath: '/',
    },
    apis: ['./swagger.js'],
}

const specs = swaggerJsdoc(options);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/**
 * @swagger
 * /agents:
 *     get:
 *       description: Return all agents
 *       produces:
 *          - application/json
 *       responses:
 *          200:
 *              description: Object food containing array of food object with prices
*/
app.get('/agents', async (req, resp) => {
        try {
          const res = await pool.query('SELECT * from sample.agents');
          resp.statusCode = 200;
          resp.setHeader('Content-Type', 'application/json');
          resp.send(res);
        } catch (err) {
          resp.statusCode = 404;
          console.error('Error executing query', err.stack);
          resp.setHeader('Content-Type', 'text/plain');
          resp.send('Error executing query' + err.stack);
        }
      });


/**
 * @swagger
 * /agents:
 *  put:
 *    description: Updates agents
 *    consumes: 
 *    - application/json
 *    produces:
 *    - application/json
 *    parameters:
 *    - in: body
 *      name: agentCode
 *      required: true
 *      schema:
 *        type: string
 *        $ref: "#/definitions/agentPut"
 *    requestBody:
 *      request: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#definitions/agentPut"
 *    responses: 
 *      200:
 *       description: A successfull response
*/
app.put('/agents', async (req, resp) => {
        try {
          const { agentName, workingArea, commission, phoneNo, country, agentCode } = req.body;
      
          const query = `update sample.agents set agent_name = '${agentName}',  working_area = '${workingArea}', commission  = '${commission}', phone_no = '${phoneNo}', country = '${country}' where agent_code = '${agentCode}'`;
      
          const res = await pool.query(query);
      
          console.log(res.affectedRows);
      
          if (res.affectedRows > 0) {
            resp.statusCode = 200;
            resp.setHeader('Content-Type', 'application/json');
            resp.send(res);
          } else {
            resp.statusCode = 201;
            resp.setHeader('Content-Type', 'text/plain');
            resp.send("The agent is not located in the table - Operation unsuccessful");
          }
        } catch (err) {
          resp.statusCode = 404;
          console.error('Error executing query', err.stack);
          resp.setHeader('Content-Type', 'text/plain');
          resp.send('Error executing query' + err.stack);
        }
      });
      



/**
 * @swagger
 * /agents:
 *  post:
 *    description: Updates agents
 *    consumes:
 *    - application/json
 *    produces:
 *    - application/json
 *    parameters:
 *    - in: body
 *      name: agentCode
 *      required: true
 *      schema:
 *        type: string
 *        $ref: "#/definitions/agentPost"
 *    requestBody:
 *      request: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#definitions/agentPost"
 *    responses:
 *      200:
 *       description: A successfull response
 
*/
app.post('/agents',(req,resp) =>{
    pool.query(`insert into sample.agents values ('${req['body'].agentCode}', '${req['body'].agentName}', '${req['body'].workingArea}', '${req['body'].commission}', '${req['body'].phone_no}', '${req['body'].country}')`).then(res => {
               console.log(res);
                 if(res.affectedRows > 0){
                        resp.statusCode = 200;
                        resp.setHeader('Content-Type','Application/json');
                        resp.send(res);
                }else{
                        resp.statusCode = 201;
                        resp.setHeader('Content-Type','text/plain');
                        resp.send('No rows added -Operation unsuccessful');
                }
               })
        .catch(err =>{
                resp.statusCode = 404;
                console.error('Error exccuting query', err.stack);
                resp.setHeader('Content-Type','text/plain');
                resp.send('Error executing query' + err.stack);
        });
});

/**
 * @swagger
 * /agents:
 *  delete:
 *    description: Removes product
 *    consumes: 
 *    - application/json
 *    produces:
 *    - application/json
 *    parameters:
 *    - in: body
 *      name: name
 *      required: true
 *      schema:
 *        type: string
 *        $ref: "#/definitions/agentDel"
 *    responses: 
 *      200:
 *       description: A successfull responseii
*/
app.delete('/agents', async (req, resp) => {
        try {
          const { agentCode } = req.body;
          const result = await pool.query(`DELETE FROM sample.agents WHERE agent_Code = '${agentCode}'`);
          console.log(result);
          if (result.affectedRows > 0) {
            resp.status(200).json(result);
          } else {
            resp.status(201).send('No rows deleted - operation unsuccessful');
          }
        } catch (err) {
          console.error('Error executing query', err.stack);
          resp.status(404).send(`Error executing query: ${err.stack}`);
        }
      });      

/**
 * @swagger
 * /agents:
 *  patch:
 *    description: updates or inserts agents
 *    consumes:
 *    - application/json
 *    produces:
 *    - application/json
 *    parameters:
 *    - in: body
 *      name: agentCode
 *      required: true
 *      schema:
 *        type: string
 *        $ref: "#/definitions/agentPatch"
 *    requestBody:
 *      request: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#definitions/agentPatch"
 *    responses:
 *      200:
 *       description: A successfull response
*/
app.patch('/agents', async (req, resp) => {
        try {
          const { agentCode, agentName, workingArea, commission, phoneNo, country } = req.body;
      
          const updateRes = await pool.query(`UPDATE sample.agents SET agent_name = '${agentName}', working_area = '${workingArea}', commission = '${commission}', phone_no = '${phoneNo}', country = '${country}' WHERE agent_code = '${agentCode}'`);
      
          if (updateRes.affectedRows > 0) {
            resp.statusCode = 200;
            resp.setHeader('Content-Type', 'Application/json');
            resp.send(updateRes);
          } else {
            const insertRes = await pool.query(`INSERT INTO sample.agents VALUES ('${agentCode}', '${agentName}', '${workingArea}', '${commission}', '${phoneNo}', '${country}')`);
      
            if (insertRes.affectedRows > 0) {
              resp.statusCode = 200;
              resp.setHeader('Content-Type', 'Application/json');
              resp.send(insertRes);
            } else {
              resp.statusCode = 201;
              resp.setHeader('Content-Type', 'text/plain');
              resp.send("The agent is not located in the table - Operation unsuccessful");
            }
          }
        } catch (err) {
          resp.statusCode = 404;
          console.error('Error executing query', err.stack);
          resp.setHeader('Content-Type', 'text/plain');
          resp.send('Error executing query' + err.stack);
        }
      });
      


app.listen(port, ()=>{
    console.log(`API server at ${port}`);
});