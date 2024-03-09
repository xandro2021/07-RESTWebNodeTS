import express, { Router } from 'express';
import path from 'path';

interface Options {
  port: number;
  routes: Router;
  public_path?: string;
}

export class Server {

  private app = express();
  private readonly port: number;
  private readonly publicPath: string;
  private readonly routes: Router;

  constructor(options: Options) {
    const { port, routes, public_path = 'public' } = options;
    this.port = port;
    this.publicPath = public_path;
    this.routes = routes;
  }

  async start() {

    /* MIDDLEWARES */
    // Creo un Middleware para convertir todo lo que venga en el body en un json. De lo contrario no podre hacer el post
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true })); // Este midleware es para habilitar las peticiones x-www-form-urlencoded

    /* PUBLIC FOLDER */
    this.app.use(express.static(this.publicPath));

    /* ROUTES */
    this.app.use(this.routes);

    /* COMODIN: cualquier ruta no definida va a pasar por aqui. SPA */
    this.app.get('*', (req, res) => {
      const indexPath = path.join(__dirname + `../../../${this.publicPath}/index.html`);
      res.sendFile(indexPath);
    })

    this.app.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    });

  }

}
