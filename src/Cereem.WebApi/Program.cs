using System.Reflection;

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
    app.UseCors(opt =>
    {
        opt.AllowAnyMethod();
        opt.AllowAnyOrigin();
        opt.AllowAnyHeader();
    });
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

public class CereemResult
{
    private CereemResult(
        bool isSuccessful,
        string? message)
    {
        IsSuccessful = isSuccessful;
        Message = message;
    }
    
    public bool IsSuccessful { get; }
    public string? Message { get; }
    
    public static CereemResult Success() =>
        new(true, null);
    
    public static CereemResult Failure(string message) =>
        new(false, message);
}
