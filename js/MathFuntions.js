/*Original Python code:
Copyright (c) 2001-2002 Enthought, Inc. 2003-2023, SciPy Developers.
All rights reserved.*/
/* Ported select sections to JavaScript by Yitzhak Oshry ydo@verizon.net*/

/*===================brentq==============================*/

/* original C code written by Charles Harris charles.harris@sdl.usu.edu */

/*
  At the top of the loop the situation is the following:

    1. the root is bracketed between xa and xb
    2. xa is the most recent estimate
    3. xp is the previous estimate
    4. |fp| < |fb|

  The order of xa and xp doesn't matter, but assume xp < xb. Then xa lies to
  the right of xp and the assumption is that xa is increasing towards the root.
  In this situation we will attempt quadratic extrapolation as long as the
  condition

  *  |fa| < |fp| < |fb|

  is satisfied. That is, the function value is decreasing as we go along.
  Note the 4 above implies that the right inequlity already holds.

  The first check is that xa is still to the left of the root. If not, xb is
  replaced by xp and the interval reverses, with xb < xa. In this situation
  we will try linear interpolation. That this has happened is signaled by the
  equality xb == xp;

  The second check is that |fa| < |fb|. If this is not the case, we swap
  xa and xb and resort to bisection.

*/
var _iter = 100;
var _xtol = 2e-12;
var _rtol = 4 * Number.EPSILON;
function brentq(f, xa, xb, func_data_param, {iter=_iter, rtol=_rtol, xtol=_xtol})
{
    var xpre = xa, xcur = xb;
    var xblk = 0., fpre, fcur, fblk = 0., spre = 0., scur = 0., sbis;
    /* the tolerance is 2*delta */
    var delta;
    var stry, dpre, dblk;
    var i;

    fpre = f(xpre, ...func_data_param);
    fcur = f(xcur, ...func_data_param);
    if (fpre == 0) {
        return xpre;
    }
    if (fcur == 0) {
        return xcur;
    }
    if (Math.sign(fpre)==Math.sign(fcur)) {
        Error("sign Error in brentq function");
        return 0.;
    }
    for (i = 0; i < iter; i++) {
        if (fpre != 0 && fcur != 0 &&
	    (Math.sign(fpre) != Math.sign(fcur))) {
            xblk = xpre;
            fblk = fpre;
            spre = scur = xcur - xpre;
        }
        if (Math.abs(fblk) < Math.abs(fcur)) {
            xpre = xcur;
            xcur = xblk;
            xblk = xpre;

            fpre = fcur;
            fcur = fblk;
            fblk = fpre;
        }

        delta = (xtol + rtol*Math.abs(xcur))/2;
        sbis = (xblk - xcur)/2;
        if (fcur == 0 || Math.abs(sbis) < delta) {
            return xcur;
        }

        if (Math.abs(spre) > delta && Math.abs(fcur) < Math.abs(fpre)) {
            if (xpre == xblk) {
                /* interpolate */
                stry = -fcur*(xcur - xpre)/(fcur - fpre);
            }
            else {
                /* extrapolate */
                dpre = (fpre - fcur)/(xpre - xcur);
                dblk = (fblk - fcur)/(xblk - xcur);
                stry = -fcur*(fblk*dblk - fpre*dpre)
                    /(dblk*dpre*(fblk - fpre));
            }
            if (2*Math.abs(stry) < Math.min(Math.abs(spre), 3*Math.abs(sbis) - delta)) {
                /* good short step */
                spre = scur;
                scur = stry;
            } else {
                /* bisect */
                spre = sbis;
                scur = sbis;
            }
        }
        else {
            /* bisect */
            spre = sbis;
            scur = sbis;
        }

        xpre = xcur; fpre = fcur;
        if (Math.abs(scur) > delta) {
            xcur += scur;
        }
        else {
            xcur += (sbis > 0 ? delta : -delta);
        }

        fcur = f(xcur, ...func_data_param);
    }
    Error("Failed to converge within the iteraction count");
    return xcur;
}

/*===================newton==============================*/

function newton(func, x0, args=[], {tol=1.48e-8, maxiter=50, rtol=0.0, disp=true}){
    if (tol <= 0) {
        Error(`tol too small (${tol} <= 0)`)
    }
    if (maxiter < 1) {
        Error("maxiter must be greater than 0")
    }
    // Convert to float (don't use float(x0); this works also for complex x0)
    var p0 = x0

    // Secant method
    var eps = 1e-4
    var p1 = x0 * (1 + eps)
    p1 += (p1 >= 0 ? eps : -eps)
    var q0 = func(p0, ...args)
    var q1 = func(p1, ...args)
    if (Math.abs(q1) < Math.abs(q0)) {
        [p0, p1, q0, q1] = [p1, p0, q1, q0]
    }
    var p = 0
    for (var itr = 0; itr < maxiter; itr++) {
        if (q1 == q0) {
            if (p1 != p0) {
                var msg = `Tolerance of ${(p1 - p0)} reached.`
                if (disp) {
                    msg += ` Failed to converge after ${itr + 1} iterations, value is ${p1}.`
                }
                Error(msg)
            }
            return (p1 + p0) / 2.0
        }
        else {
            if (Math.abs(q1) > Math.abs(q0)) {
                p = (-q0 / q1 * p1 + p0) / (1 - q0 / q1)
            }
            else {
                p = (-q1 / q0 * p0 + p1) / (1 - q1 / q0)
            }
        }
        if (Math.abs(p-p1) <= tol + rtol * Math.abs(p1)) {
            return p
        }
        [p0, q0] = [p1, q1]
        p1 = p
        q1 = func(p1, ...args)
    }

    if (disp) {
        Error(`Failed to converge after ${itr + 1} iterations, value is ${p}.`)
    }

    return p
}

// Multiply steps computed from asymptotic behaviour of errors by this.
const SAFETY = 0.9

const MIN_FACTOR = 0.2  // Minimum allowed decrease in a step size.
const MAX_FACTOR = 10   // Maximum allowed increase in a step size.
function rk_step(fun, t, y, h, A, B, C, order) {
/*    """Perform a single Runge-Kutta step.

    This function computes a prediction of an explicit Runge-Kutta method and
    also estimates the error of a less accurate method.

    Notation for Butcher tableau is as in [1]_.

    Parameters
    ----------
    fun : callable
        Right-hand side of the system.
    t : float
        Current time.
    y : ndarray, shape (n,)
        Current state.
    f : ndarray, shape (n,)
        Current value of the derivative, i.e., ``fun(x, y)``.
    h : float
        Step to use.
    A : ndarray, shape (n_stages, n_stages)
        Coefficients for combining previous RK stages to compute the next
        stage. For explicit methods the coefficients at and above the main
        diagonal are zeros.
    B : ndarray, shape (n_stages,)
        Coefficients for combining RK stages for computing the final
        prediction.
    C : ndarray, shape (n_stages,)
        Coefficients for incrementing time for consecutive RK stages.
        The value for the first stage is always zero.
    K : ndarray, shape (n_stages + 1, n)
        Storage array for putting RK stages here. Stages are stored in rows.
        The last row is a linear combination of the previous rows with
        coefficients

    Returns
    -------
    y_new : ndarray, shape (n,)
        Solution at t + h computed with a higher accuracy.
    f_new : ndarray, shape (n,)
        Derivative ``fun(t + h, y_new)``.

    References
    ----------
    .. [1] E. Hairer, S. P. Norsett G. Wanner, "Solving Ordinary Differential
           Equations I: Nonstiff Problems", Sec. II.4.
    """*/
    var K = [];
    K[0] = fun(y,t);
    var y_new = y;
    for (var i = 1; i < order; i++) {
        var dt = t + C[i] * h;
        var dy = Array(y.length).fill(0);
        for (var yi = 0; yi < y.length; yi++) {
            for (var j = 0; j < i; j++) {
                dy[yi] += A[i][j]*K[j][yi];
            }
            dy[yi]=dy[yi] * h + y[yi];
        }
        K[i] = fun(dy,dt);
        for (var yi = 0; yi < y.length; yi++) {
            y_new[yi] += B[i] * K[i][yi] * h;
        }
    }
    return y_new;
}

function _estimate_error_norm(K, E, h, scale){
    return norm(np.dot(K.T, E) * h / scale)
}

/*==================solve_ivp===========================*/
//Explicit Runge-Kutta method of order 3(2)
function solve_ivp(func,y0,t_span,args=[],rtol=1e-3, atol=1e-6,max_step=Infinity) {

    //order 3(2) settings
    var order = 3;
    var error_exponent  = -1/3;
    var n_stages = 3;
    var C = [0, 1/2, 3/4];
    var A = [
        [0, 0, 0],
        [1/2, 0, 0],
        [0, 3/4, 0]
    ];
    var B = [2/9, 1/3, 4/9];
    var E = [5/72, -1/12, -1/9, 1/8];
    var P = [[1, -4 / 3, 5 / 9],
                  [0, 1, -2/3],
                  [0, 4/3, -8/9],
                  [0, -1, 1]];

    //processing
    var t0=t_span[0];
    var t_bound=t_span[1];
    var direction = t0==t_bound ? 1 : Math.sign(t_bound-t0);
    var h_abs;

    var fun = function(y,t){return func(y,t,...args)};
    var t = t0;
    var y = y0;
    while (t < t_bound) {
        var y_new = rk_step(fun, t, y, 0.000155, A, B, C, order)
        y = y_new;
        t += 0.000155;
    }
    return y_new;
    var y = y0;
    //while (direction * (t - t_bound) >= 0) {
        t = t
        y = y

        var min_step = 10*Number.EPSILON;

        h_abs = Math.max(Math.min(h_abs, max_step), min_step)

        var step_accepted = false
        var step_rejected = false

        while (!step_accepted) {
            if (h_abs < min_step) {
                return false;
            }

            var h = h_abs * direction
            var t_new = t + h

            if (direction * (t_new - t_bound) > 0) {
                t_new = t_bound
            }

            h = t_new - t
            h_abs = Math.abs(h)

            var y_new = rk_step(fun, t, y, 0.000155, A, B, C, order)
            var scale = atol + Math.max(Math.abs(y), Math.abs(y_new)) * rtol
            var error_norm = .1;//_estimate_error_norm(K, h, scale)
            var factor = 1
            if (error_norm < 1) {
                if (error_norm == 0) {
                    factor = MAX_FACTOR
                }
                else {
                    factor = Math.min(MAX_FACTOR,
                                SAFETY * error_norm ** error_exponent)
                }

                if (step_rejected) {
                    factor = Math.min(1, factor)
                }

                h_abs *= factor

                step_accepted = true
            }
            else {
                h_abs *= Math.max(MIN_FACTOR,
                            SAFETY * error_norm ** error_exponent)
                step_rejected = true
            }
        }

        t = t_new
        y = y_new
    //}
    return y_new;
}



/*===================fsolve==============================
function fsolve(func, x0, args=(), full_output=0,
           col_deriv=0, xtol=1.49012e-8, maxfev=0, factor=100) {
    var options = {'col_deriv': col_deriv,
               'xtol': xtol,
               'maxfev': maxfev,
               'eps': epsfcn,
               'factor': factor}

    //var res = _root_hybr(func, x0, args, **options)
    var epsfcn = Number.EPSILON

    x0 = asarray(x0).flatten()
    n = len(x0)
    if not isinstance(args, tuple):
        args = (args,)
    shape, dtype = _check_func('fsolve', 'func', func, x0, args, n, (n,))
    if epsfcn is None:
        epsfcn = finfo(dtype).eps

    var [ml, mu] = [-10, -10]

    if maxfev == 0:
        maxfev = 200 * (n + 1)
    retval = _minpack._hybrd(func, x0, args, 1, xtol, maxfev,
                                ml, mu, epsfcn, factor, diag)

    x, status = retval[0], retval[-1]

    Errors = {0: "Improper input parameters were entered.",
              1: "The solution converged.",
              2: "The number of calls to function has "
                  "reached maxfev = %d." % maxfev,
              3: "xtol=%f is too small, no further improvement "
                  "in the approximate\n  solution "
                  "is possible." % xtol,
              4: "The iteration is not making good progress, as measured "
                  "by the \n  improvement from the last five "
                  "Jacobian evaluations.",
              5: "The iteration is not making good progress, "
                  "as measured by the \n  improvement from the last "
                  "ten iterations.",
              'unknown': "An Error occurred."}

    info = retval[1]
    info['fun'] = info.pop('fvec')
    sol = OptimizeResult(x=x, success=(status == 1), status=status)
    sol.update(info)
    try:
        sol['message'] = Errors[status]
    except KeyError:
        sol['message'] = Errors['unknown']

    return sol





    var status = res['status']
    var msg = res['message']
    if (status != 0) {
        Error(msg)
    }
    return res['x']

}
*/