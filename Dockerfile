FROM node:20-alpine AS frontend
WORKDIR /app/pharmacy-frontend
COPY pharmacy-frontend/package*.json ./
RUN npm ci
COPY pharmacy-frontend/ ./
RUN npm run build

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY . .
COPY --from=frontend /app/wwwroot ./wwwroot
RUN dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
EXPOSE 10000
COPY --from=build /app/publish .
ENV ASPNETCORE_URLS=http://+:10000
ENTRYPOINT ["dotnet", "PharmacyApp.dll"]
