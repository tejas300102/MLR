namespace MLR.DTOs;


public static class ValidationPatterns
{

    public const string PersonName = @"^[A-Za-z][A-Za-z ]{0,49}$";


    public const string Email = @"^[^@\s]+@[^@\s]+\.[^@\s]+$";


    public const string Password = @"^(?=.*\d).{6,}$";


    public const string NonEmptyText500 = @"^.{1,500}$";
}
