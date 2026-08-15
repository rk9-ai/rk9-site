# RK9 AI marketing site — plain static files served by nginx.
# No build step: site/ is committed ready-to-serve (the homepage is a
# self-contained single HTML file with fonts and scripts inlined).

FROM nginx:alpine
# Container nginx: gzip, no-cache on HTML, /healthz.
COPY deploy/nginx/container.conf /etc/nginx/conf.d/default.conf
COPY site/ /usr/share/nginx/html/

EXPOSE 80
HEALTHCHECK --interval=10s --timeout=3s --retries=3 --start-period=5s \
    CMD wget -qO- http://127.0.0.1:80/healthz || exit 1
