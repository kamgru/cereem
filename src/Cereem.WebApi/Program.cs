using System.Reflection;
using Cereem.WebApi.Data;
using Microsoft.EntityFrameworkCore;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();
builder.Services.AddFeatureHandlers();
builder.Services.AddDbContext<CereemContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("Cereem")));

WebApplication app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapControllers()
    .WithOpenApi();

app.UseHttpsRedirection();
app.Run();

public static class ServicesBootstrap
{
    public static IServiceCollection AddFeatureHandlers(
        this IServiceCollection services)
    {
        foreach (Type type in Assembly.GetExecutingAssembly()
                     .GetTypes()
                     .Where(t => t.IsDefined(typeof(InjectableAttribute), false)))
        {
            services.AddScoped(type);
        }

        return services;
    }
}

[AttributeUsage(AttributeTargets.Class)]
public class InjectableAttribute : Attribute;

public class CereemResult<TData>
{
    private CereemResult(
        TData? data,
        string? message,
        bool isSuccessful)
    {
        Data = data;
        Message = message;
        IsSuccessful = isSuccessful;
    }

    public TData? Data { get; }
    public string? Message { get; }
    public bool IsSuccessful { get; }

    public static CereemResult<TData> Success(
        TData data) =>
        new(data, null, true);

    public static CereemResult<TData> Failure(
        string message) =>
        new(default, message, false);
}
