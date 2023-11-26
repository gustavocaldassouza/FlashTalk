# Use the official image as a parent image.
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

# Use the .NET SDK for building our application
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY ["FlashTalk.Presentation/FlashTalk.Presentation.csproj", "flashtalk-webapi/"]
COPY ["FlashTalk.Infrastructure/FlashTalk.Infrastructure.csproj", "flashtalk-webapi/"]
COPY ["FlashTalk.Application/FlashTalk.Application.csproj", "flashtalk-webapi/"]
COPY ["FlashTalk.Domain/FlashTalk.Domain.csproj", "flashtalk-webapi/"]
RUN dotnet restore "flashtalk-webapi/FlashTalk.Presentation.csproj"

COPY . .
WORKDIR "/src"
RUN dotnet build "FlashTalk.sln" -c Release -o /app/build

# Publish the application
FROM build AS publish
RUN dotnet publish "FlashTalk.sln" -c Release -o /app/publish

# Final stage / image
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENV ASPNETCORE_URLS=http://*:80
ENTRYPOINT ["dotnet", "FlashTalk.Presentation.dll"]