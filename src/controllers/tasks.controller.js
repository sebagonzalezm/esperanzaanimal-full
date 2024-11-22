const pool = require('../db')

const getAllTask = async (req,res,next) =>{
    try{
    const allTasks = await pool.query('SELECT * FROM task')
    res.json(allTasks.rows)
    }catch(error){
        next(error)
    }
}
const getTask = async(req,res) =>{
    try{
        const {id} = req.params
    const result = await pool.query('SELECT * FROM task WHERE id = $1',[id])
    if(result.rows.length == 0)return res.status(404).json({message:"Task not found"})
    res.json(result.rows[0]);
    }catch(error){
        next(error)
    }
}

const createTask = async (req,res,next) =>{
    const {title, description} = req.body
    try{
        const result = await pool.query('INSERT INTO task (title, description) VALUES ($1, $2) RETURNING *', [title, description]);
    res.json(result.rows[0]);
    }catch(error){
        next(error)
    }
}
const deleteTask = async (req,res) =>{
    try{
    const { id } = req.params
    const result = await pool.query('DELETE FROM task where id = $1',[id])
    
    if(result.rowCount == 0) return res.status(404).json({message: "Task not found"});
    return res.sendStatus(204);
    }catch(error){
        next(error)
    }
}

const updateTask = async (req,res) =>{
    try{
        const {id} = req.params;
    const {title, description} = req.body;
    const result = await pool.query('UPDATE task SET title = $1, description =$2 WHERE id = $3 RETURNING *',[title,description,id])
    if(result.rows.length == 0){
        return res.status(404).json({message: "Task not found"})
    }
    return res.json(result.rows[0]);
    }catch(error){
        next(error)
    }
}

//const bcrypt = require('bcrypt'); // Para comparar las contraseñas cifradas

const loginUser = async (req, res, next) => {
    const { correo, contrasena } = req.body;
  
    if (!correo || !contrasena) {
      return res.status(400).json({ message: 'Correo y contraseña son requeridos' });
    }
  
    try {
      // Consulta al usuario en la base de datos
      const result = await pool.query('SELECT * FROM usuarios WHERE correo = $1', [correo]);
  
      if (result.rows.length == 0) {
        console.log('Usuario no encontrado');
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
  
      const user = result.rows[0];
      console.log('Usuario encontrado:', user);
  
      // Comparar la contraseña proporcionada con la almacenada
      if (user.contrasena !== contrasena) {
        console.log('Contraseña incorrecta');
        return res.status(401).json({ message: 'Contraseña incorrecta' });
      }
  
      // Si todo es correcto, devuelves el usuario
      console.log('Inicio de sesión exitoso');
      res.json({
        message: 'Inicio de sesión exitoso',
        user: {
          id: user.id,
          correo: user.correo,
        },
      });
  
    } catch (error) {
      console.error('Error en login:', error);
      next(error);
    }
    console.log('Correo:', correo);
    console.log('Contraseña:', contrasena);

  }
  const signupUser = async (req, res, next) => {
    const { nombre, apellido, correo, contrasena } = req.body;
  
    if (!nombre || !apellido || !correo || !contrasena) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }
  
    try {
      const emailCheck = await pool.query('SELECT * FROM usuarios WHERE correo = $1', [correo]);
      if (emailCheck.rows.length > 0) {
        return res.status(409).json({ message: 'El correo ya está registrado' });
      }
  
      // Insertar el nuevo usuario con rol 'cliente'
      const result = await pool.query(
        'INSERT INTO usuarios (nombre, apellido, correo, contrasena, rol) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [nombre, apellido, correo, contrasena, 'cliente'] // Se incluye el rol 'cliente'
      );
  
      const newUser = result.rows[0];
      res.status(201).json({
        message: 'Registro exitoso',
        user: {
          id: newUser.id,
          nombre: newUser.nombre,
          apellido: newUser.apellido,
          correo: newUser.correo,
          rol: newUser.rol, // Devolver también el rol
        },
      });
    } catch (error) {
      console.error('Error en registro:', error);
      next(error);
    }
  };
module.exports = {
    getAllTask,
    getTask,
    createTask,
    deleteTask,
    updateTask,
    loginUser,
    signupUser
}