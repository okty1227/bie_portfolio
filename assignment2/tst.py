def func1(n):
    
    result = n
    
    def func2():
        global result
        result = result+1
        return  result
    
    return func2
getfunc1 = func1(10)
getfunc1()
getfunc1()