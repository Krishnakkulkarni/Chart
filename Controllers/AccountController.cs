using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using WebApi.Models;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
       private readonly UserManager<ApplicationUser> userManager;

       private readonly SignInManager<ApplicationUser> signInManager;

       private readonly LoginSecurity loginSecurity;

       public AccountController(UserManager<ApplicationUser> usermanager,SignInManager<ApplicationUser> signinManager, IOptions<LoginSecurity> loginsecurity)
       {
            loginSecurity = loginsecurity.Value;
            userManager = usermanager;
            signInManager = signinManager;
       }

        [HttpPost]
        [Route("signup")]
        public async Task<IActionResult> PostpplicationUser(ApplicationUserModel model)
        {
            ////creating new object of type application user
            var applicationUser = new ApplicationUser()
            {
                UserName = model.UserName,
                Email = model.Email,
                FullName = model.FullName,
                Role = model.Role
            };
            try
            {
                ////password as to be encrypted
                var result = await this.userManager.CreateAsync(applicationUser, model.Password);
                //if (result.Succeeded)
                //{
                //    var user = await this.userManager.FindByNameAsync(model.UserName);
                //    var code = await this.userManager.GenerateEmailConfirmationTokenAsync(user);
                //    string callBackUrl = Url.Link("ConfirmEmail", new { userName = user, code });
                //    await this.emailSender.SendEmailAsync(model.Email, "Confirm your account", $"Please confirm your account by clicking this link: < a href =\"" + callBackUrl + "\">Link</a>");
                //}

                return this.Ok(result);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        [HttpPost]
        [Route("login")]
        public async Task<dynamic> Login(ApplicationLoginModel model)
        {
            try
            {
                var user = await this.userManager.FindByNameAsync(model.UserName);
                if (user != null && await this.userManager.CheckPasswordAsync(user, model.Password))
                {
                    var tokenDescriptor = new SecurityTokenDescriptor
                    {
                        Subject = new ClaimsIdentity(new Claim[]
                        {
                       new Claim("UserID", user.Id.ToString())
                        }),
                        ////expire time set to one day
                        Expires = DateTime.UtcNow.AddMinutes(5),
                        SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(this.loginSecurity.JWT_Secrete)), SecurityAlgorithms.HmacSha256Signature)
                    };
                    var tokenHandler = new JwtSecurityTokenHandler();
                    var securityToken = tokenHandler.CreateToken(tokenDescriptor);
                    var token = tokenHandler.WriteToken(securityToken);

                    model.Success = true;
                    model.Token = token;
                    model.Userid = user.Id;
                    return model;
                }
                var Email = await this.userManager.FindByEmailAsync(model.UserName);
                if (Email != null && await this.userManager.CheckPasswordAsync(Email, model.Password))
                {
                    var tokenDescriptor = new SecurityTokenDescriptor
                    {
                        Subject = new ClaimsIdentity(new Claim[]
                        {
                       new Claim("UserID", Email.Id.ToString())
                        }),
                        ////expire time set to one day
                        Expires = DateTime.UtcNow.AddMinutes(5),
                        SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(this.loginSecurity.JWT_Secrete)), SecurityAlgorithms.HmacSha256Signature)
                    };
                    var tokenHandler = new JwtSecurityTokenHandler();
                    var securityToken = tokenHandler.CreateToken(tokenDescriptor);
                    var token = tokenHandler.WriteToken(securityToken);

                    model.Success = true;
                    model.Token = token;
                    model.Userid = user.Id;
                    return model;
                }
                else
                {
                    model.Success = false;
                    return model;
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        [HttpGet]
        [Route("profile/{id}")]
        public async Task<IActionResult> UserProfile(string id)
        {

            var user = await this.userManager.FindByIdAsync(id);
            if (user != null)
            {
                return this.Ok(new { user });
            }
            else
            {
                return BadRequest();
            }
        }
    }
}