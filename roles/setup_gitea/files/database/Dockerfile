FROM docker.io/postgres:14

EXPOSE 5432

ENV POSTGRES_USER=gitea

ENV POSTGRES_PASSWORD=gitea

ENV POSTGRES_DB=gitea

ENTRYPOINT ["docker-entrypoint.sh"]

CMD ["postgres"]