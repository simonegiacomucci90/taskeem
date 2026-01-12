# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:10.0-preview AS build
WORKDIR /src

# Copia csproj e ripristina pacchetti
COPY Taskeem.Worker.Notifier/*.csproj ./Taskeem.Worker.Notifier/
COPY Taskeem.Domain/*.csproj ./Taskeem.Domain/
COPY Taskeem.Domain.EF/*.csproj ./Taskeem.Domain.EF/
RUN dotnet restore Taskeem.Worker.Notifier/*.csproj

# Copia tutto e build
COPY Taskeem.Worker.Notifier/. ./Taskeem.Worker.Notifier/
COPY Taskeem.Domain/. ./Taskeem.Domain/
COPY Taskeem.Domain.EF/. ./Taskeem.Domain.EF/
WORKDIR /src/Taskeem.Worker.Notifier
RUN dotnet publish Taskeem.Worker.Notifier.csproj -c Release -o /app/publish

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/runtime:10.0-preview
WORKDIR /app

COPY --from=build /app/publish .

RUN mkdir -p /app/logs

ENV DOTNET_RUNNING_IN_CONTAINER=true

ENTRYPOINT ["dotnet", "Taskeem.Worker.Notifier.dll"]