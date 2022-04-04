module.exports = {
  apps: [
    {
      name: "laravel-app",
      script: "json-server",
      interpreter: "/var/lib/jenkins/workspace/quan_ly_thuc_tap",
      args: ["--watch", "--host 139.180.196.74", "--port 2000"],
      instances: "1",
      wait_ready: true,
      autorestart: false,
      max_restarts: 1,
      interpreter: "js",
      watch: true,
      error_file: "log/err.log",
      out_file: "log/out.log",
      log_file: "log/combined.log",
      time: true,
    },
  ],
};
