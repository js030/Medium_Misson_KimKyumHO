'use client'

import { useEffect, useRef, useState } from 'react'
import {
  PaymentWidgetInstance,
  loadPaymentWidget,
  ANONYMOUS,
} from '@tosspayments/payment-widget-sdk'
import { nanoid } from 'nanoid'
import '../../styles/toss.css'
import { useQuery } from '@tanstack/react-query'

const selector = '#payment-widget'

// TODO: clientKey는 개발자센터의 결제위젯 연동 키 > 클라이언트 키로 바꾸세요.
// TODO: customerKey는 구매자와 1:1 관계로 무작위한 고유값을 생성하세요.
// @docs https://docs.tosspayments.com/reference/widget-sdk#sdk-설치-및-초기화
const clientKey = process.env.NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY
const customerKey = nanoid()

export function CheckoutPage() {
  const { data: paymentWidget } = usePaymentWidget(clientKey, customerKey)
  // const paymentWidget = usePaymentWidget(clientKey, ANONYMOUS); // 비회원 결제
  const paymentMethodsWidgetRef = useRef(null)
  const [price, setPrice] = useState(20_00)

  useEffect(() => {
    if (paymentWidget == null) {
      return
    }

    // ------  결제 UI 렌더링 ------
    // @docs https://docs.tosspayments.com/reference/widget-sdk#renderpaymentmethods선택자-결제-금액-옵션
    const paymentMethodsWidget = paymentWidget.renderPaymentMethods(
      selector,
      { value: price },
      { variantKey: 'DEFAULT' }
    )

    // ------  이용약관 UI 렌더링 ------
    // @docs https://docs.tosspayments.com/reference/widget-sdk#renderagreement선택자-옵션
    paymentWidget.renderAgreement('#agreement', { variantKey: 'AGREEMENT' })

    paymentMethodsWidgetRef.current = paymentMethodsWidget
  }, [paymentWidget])

  useEffect(() => {
    const paymentMethodsWidget = paymentMethodsWidgetRef.current

    if (paymentMethodsWidget == null) {
      return
    }

    // ------ 금액 업데이트 ------
    // @docs https://docs.tosspayments.com/reference/widget-sdk#updateamount결제-금액
    paymentMethodsWidget.updateAmount(price)
  }, [price])

  return (
    <div className='wrapper'>
      <div className='box_section'>
        <div id='payment-widget' />
        <div id='agreement' />

        <div className='result wrapper'>
          <button
            className='button'
            style={{ marginTop: '30px' }}
            onClick={async () => {
              // TODO: 결제를 요청하기 전에 orderId, amount를 서버에 저장하세요.
              // 결제 과정에서 악의적으로 결제 금액이 바뀌는 것을 확인하는 용도입니다.
              try {
                // ------ '결제하기' 버튼 누르면 결제창 띄우기 ------
                // @docs https://docs.tosspayments.com/reference/widget-sdk#requestpayment결제-정보
                await paymentWidget?.requestPayment({
                  orderId: nanoid(),
                  orderName: '미디엄 멤버십 결제',
                  customerName: '김토스',
                  customerEmail: 'customer123@gmail.com',
                  customerMobilePhone: '01012341234',
                  successUrl: `${window.location.origin}/membership/success`,
                  failUrl: `${window.location.origin}/membership/fail`,
                })
              } catch (error) {
                // 에러 처리하기
                console.error(error)
              }
            }}>
            결제하기
          </button>
        </div>
      </div>
    </div>
  )
}

function usePaymentWidget(clientKey, customerKey) {
  return useQuery({
    queryKey: ['payment-widget', clientKey, customerKey],
    queryFn: () => {
      // ------  결제위젯 초기화 ------
      // @docs https://docs.tosspayments.com/reference/widget-sdk#sdk-설치-및-초기화
      return loadPaymentWidget(clientKey, customerKey)
    },
  })
}
