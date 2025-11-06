#include <iostream>
#include <vector>
#include <thread>
#include <ctime>
using std::cout;
using std::thread;
using std::ref;


void sumPart(std::vector<int>& vec, int start, int end, long long& result) {
    result = 0;
    for (int i = start; i < end; i++) {
        result += vec[i];
    }
}


int main() {
    srand(time(0)); // генератор случайных чисел
    std::vector<int> vec(1000000);

    clock_t start = clock();
    
    for (int i = 0; i < vec.size(); i++) {
        vec[i] = rand() % 100; // заполняем случайными числами от 0 до 99
    }

    clock_t end = clock();
    
    double elapsed_secs = double(end - start) / CLOCKS_PER_SEC;
    cout << "время заполнения: " << elapsed_secs << " сек" << std::endl;

    // переменные для хранения частичных сумм из каждого потока
    long long sum1 = 0, sum2 = 0, sum3 = 0, sum4 = 0;
    
    clock_t start2 = clock();
    
    // 4 потока, каждый обрабатывает свою четверть вектора
    thread t1(sumPart, ref(vec), 0, 250000, ref(sum1));
    thread t2(sumPart, ref(vec), 250000, 500000, ref(sum2));
    thread t3(sumPart, ref(vec), 500000, 750000, ref(sum3));
    thread t4(sumPart, ref(vec), 750000, 1000000, ref(sum4));
    

    t1.join();
    t2.join();
    t3.join();
    t4.join();
 

    long long total = sum1 + sum2 + sum3 + sum4;
    
    clock_t end2 = clock();

    double elapsed2 = double(end2 - start2) / CLOCKS_PER_SEC;
    
    cout << "сумма: " << total << std::endl;
    cout << "время: " << elapsed2 << " сек" << std::endl;

    return 0;
}