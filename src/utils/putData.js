'use server'

export default async function putData(formdata) {
    try {
       const name = formdata.get('name')
       const email = formdata.get('email')
       const password = formdata.get('password')
    
       if(!(email && password && name)){
         throw new Error("all feids are required")
       }
       
       const client = await connectDb.connect();
       const queryText = 'INSERT INTO users(name, email, password) VALUES($1, $2, $3)';
       const values = [name, email, password];
       const response = await client.query(queryText, values);
    } catch (error) {
       console.log(error)
    }
 }