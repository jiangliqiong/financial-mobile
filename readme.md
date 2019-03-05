npm install »cnpm install  //安装依赖
npm install -g supervisor  //安装supervisor

supervisor ./bin/www  //启动项目


里面有PM2.json文件,本项目后来部署服务器是用了pm2部署的，它可以更好的管理项目，并且进行线上运行的监控。
