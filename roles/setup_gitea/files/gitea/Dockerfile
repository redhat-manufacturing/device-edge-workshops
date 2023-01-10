FROM docker.io/gitea/gitea:1.17.3

ENV USER_UID=1000

ENV USER_GID=1000

COPY app.ini /data/gitea/conf/app.ini

EXPOSE 22

EXPOSE 3000

ENTRYPOINT ["/usr/bin/entrypoint"]

CMD ["/bin/s6-svscan", "/etc/s6"]