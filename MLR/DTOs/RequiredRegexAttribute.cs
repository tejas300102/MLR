using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace MLR.DTOs;


[AttributeUsage(AttributeTargets.Property | AttributeTargets.Field | AttributeTargets.Parameter, AllowMultiple = false)]
public sealed class RequiredRegexAttribute : ValidationAttribute
{
    private readonly Regex _regex;

    public RequiredRegexAttribute(string pattern)
    {
        _regex = new Regex(pattern, RegexOptions.Compiled | RegexOptions.CultureInvariant);
    }

    public override bool IsValid(object? value)
    {
        if (value is null) return false;

        var s = value as string ?? value.ToString();
        if (string.IsNullOrWhiteSpace(s)) return false;

        return _regex.IsMatch(s);
    }
}
