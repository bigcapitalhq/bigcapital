#!/bin/bash

if [[ "$MANAGEMENT" = true ]]; then
    rabbitmq-plugins enable --offline rabbitmq_management
fi

if [[ "$FEDERATION" = true ]]; then
    rabbitmq-plugins enable --offline rabbitmq_federation
    if [[ "$MANAGEMENT" = true ]]; then
        rabbitmq-plugins enable --offline rabbitmq_federation_management
    fi
fi

